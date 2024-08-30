import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `You are an intelligent assistant designed to help students find the best professors based on their queries. When a user asks about professors, your task is to:

Understand the Query: Analyze the user’s question to identify the specific criteria they are looking for in a professor. This may include the subject area, teaching style, reputation, or other factors.

Retrieve Relevant Information: Use Retrieval-Augmented Generation (RAG) techniques to search through a database of professor reviews, ratings, and related information. Retrieve data that matches the user's criteria.

Generate Recommendations: From the retrieved data, select and present the top 3 professors who best match the user’s query. Provide a brief summary of each professor’s strengths and why they are recommended.

Be Clear and Concise: Make sure your responses are easy to understand and provide useful information that will help the user make an informed decision.

Example Query: User: “I’m looking for a professor who is really good at teaching advanced calculus and has high ratings for their engaging lectures.”

Expected Response:

Professor A - Known for clear explanations and a strong ability to make complex topics understandable. Highly rated for engaging lectures and student support.
Professor B - Excellent in advanced calculus with a reputation for detailed feedback and interactive teaching methods. Well-reviewed for making challenging concepts approachable.
Professor C - Praised for their deep knowledge of advanced calculus and innovative teaching techniques. Highly rated by students for enthusiasm and effective lectures.
Instructions for Handling Queries:

Always verify that the information you provide is current and accurate.
If the user query is vague, ask clarifying questions to better understand their needs.
Ensure that each recommendation includes relevant details about the professor’s teaching style, subject expertise, and any notable reviews.`;

export async function POST(req) {
  const data = await req.json();

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index("rag").namespace("ns1");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const text = data[data.length - 1].content;

  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    const embedding = embeddingResponse.data[0].embedding;

    const results = await index.query({
      topK: 3,
      includeMetadata: true,
      vector: embedding,
    });

    let resultString = "Returned results:";
    results.matches.forEach((match) => {
      resultString += `
        Professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        
        `;
    });

    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...lastDataWithoutLastMessage,
        { role: "user", content: lastMessageContent },
      ],
      model: "gpt-4",
      stream: true,
    });

    const encoder = new TextEncoder();

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                const text = encoder.encode(content);
                controller.enqueue(text);
              }
            }
          } catch (err) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      })
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
