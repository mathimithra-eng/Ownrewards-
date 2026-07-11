import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const type = formData.get('type');

    if (type === 'suggestion') {
      const text = formData.get('text');
      // In a real app, save to database here
      console.log('Received Suggestion:', { text });
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, message: 'Suggestion saved successfully.' });
    } 
    
    if (type === 'feedback') {
      const purchaseId = formData.get('purchaseId');
      const rating = formData.get('rating');
      const comment = formData.get('comment');
      const file = formData.get('file') as File | null;
      
      // In a real app, save to database here and upload file to cloud storage (S3/GCS)
      console.log('Received Feedback:', { 
        purchaseId, 
        rating, 
        comment, 
        fileName: file?.name, 
        fileSize: file?.size 
      });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, message: 'Feedback saved successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error processing feedback/suggestion:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
