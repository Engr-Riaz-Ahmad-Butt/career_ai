import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000/api/v1';

async function main() {
  // 1. Create a dummy user directly in DB to get an ID
  const email = `api_test_styling_${Date.now()}@example.com`;
  const user = await prisma.user.create({
    data: {
      email,
      firstName: 'ApiTest',
      lastName: 'Styling',
      password: 'password123',
    }
  });

  let _token = '';
  try {
     const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
            firstName: 'ApiTest',
            lastName: 'Styling2',
            email: `api_test_styling_req_${Date.now()}@example.com`,
            password: 'Password123!',
        })
     });
     
     if (!registerRes.ok) {
         throw new Error(`Register error: ${await registerRes.text()}`);
     }
     
     const data = await registerRes.json() as any;
     _token = data.data.accessToken;
  } catch (err: any) {
     console.error('Registration failed:', err.message);
     process.exit(1);
  }

  try {
      // 2. Create resume via API
      console.log('Testing create resume via API...');
      const createRes = await fetch(`${API_URL}/resumes`, {
         method: 'POST',
         headers: { 
             'Content-Type': 'application/json',
             Authorization: `Bearer ${_token}`,
             Origin: 'http://localhost:3000'
         },
         body: JSON.stringify({
             title: 'API Styling Test',
             template: 'creative',
             styling: { theme: 'dark', color: '#ff00ff' }
         })
      });

      if (!createRes.ok) {
          throw new Error(`Create error: ${await createRes.text()}`);
      }

      const createData = await createRes.json() as any;
      const resumeId = createData.data.resume.id;
      console.log('Created resume via API:', resumeId);
      console.log('Returned styling on CREATE:', createData.data.resume.styling);

      // 3. Update resume via API
      console.log('\nTesting update resume via API...');
      const updateRes = await fetch(`${API_URL}/resumes/${resumeId}`, {
         method: 'PUT',
         headers: { 
             'Content-Type': 'application/json',
             Authorization: `Bearer ${_token}`,
             Origin: 'http://localhost:3000'
         },
         body: JSON.stringify({
             styling: { theme: 'light', color: '#00ff00', font: 'Roboto' }
         })
      });

      if (!updateRes.ok) {
          throw new Error(`Update error: ${await updateRes.text()}`);
      }

      const updateData = await updateRes.json() as any;
      console.log('Updated resume styling:', updateData.data.resume.styling);

      // 4. Fetch resume via API
      console.log('\nTesting get resume via API...');
      const getRes = await fetch(`${API_URL}/resumes/${resumeId}`, {
         headers: { 
            Authorization: `Bearer ${_token}`,
            Origin: 'http://localhost:3000'
         }
      });

      if (!getRes.ok) {
          throw new Error(`Get error: ${await getRes.text()}`);
      }

      const getData = await getRes.json() as any;
      console.log('Fetched resume styling:', getData.data.resume.styling);

  } catch (err: any) {
      console.error('API Test failed:', err.message);
  } finally {
      // cleanup DB
      await prisma.user.deleteMany({
          where: {
              email: { contains: 'api_test_styling' }
          }
      });
      await prisma.$disconnect();
  }
}

main();
