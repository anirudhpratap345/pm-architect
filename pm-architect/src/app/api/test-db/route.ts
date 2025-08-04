import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const decisionCount = await prisma.decision.count();
    const commentCount = await prisma.comment.count();
    const notificationCount = await prisma.notification.count();

    return NextResponse.json({
      success: true,
      counts: {
        users: userCount,
        decisions: decisionCount,
        comments: commentCount,
        notifications: notificationCount,
      },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Create a test user if none exists
    let testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' },
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });
    }

    // Create a test decision
    const testDecision = await prisma.decision.create({
      data: {
        title: 'Test Decision: AI Model Selection',
        description: 'Choosing between GPT-4 and Claude for our summarization feature',
        context: 'We need to select an AI model for our new summarization feature. Cost and performance are key considerations.',
        status: 'open',
        priority: 'high',
        createdBy: testUser.id,
        options: ['GPT-4', 'Claude 3', 'Mistral'],
        constraints: ['Budget < $1000/month', 'Response time < 2s'],
        metrics: ['Accuracy', 'Cost', 'Latency'],
        stakeholders: ['alex@company.com', 'sarah@company.com'],
        tags: ['AI', 'Model Selection', 'Summarization'],
      },
    });

    // Create some test comments
    const testComments = await Promise.all([
      prisma.comment.create({
        data: {
          decisionId: testDecision.id,
          userId: testUser.id,
          content: 'I think GPT-4 would be the best choice for accuracy. @alex@company.com what do you think?',
          mentions: ['alex@company.com'],
        },
      }),
      prisma.comment.create({
        data: {
          decisionId: testDecision.id,
          userId: testUser.id,
          content: 'But Claude might be more cost-effective. Let me check the pricing.',
          mentions: [],
        },
      }),
    ]);

    // Create a test notification
    const testNotification = await prisma.notification.create({
      data: {
        userId: testUser.id,
        decisionId: testDecision.id,
        type: 'mention',
        title: 'You were mentioned in a comment',
        message: 'Test User mentioned you in a comment on "Test Decision: AI Model Selection"',
      },
    });

    return NextResponse.json({
      success: true,
      created: {
        user: testUser,
        decision: testDecision,
        comments: testComments,
        notification: testNotification,
      },
    });
  } catch (error) {
    console.error('Test data creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create test data', details: error },
      { status: 500 }
    );
  }
} 