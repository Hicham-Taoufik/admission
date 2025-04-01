const API_BASE_URL = 'https://workflows.aphelionxinnovations.com/webhook';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiZmJmMmI1ZjctZTc3ZS00ZGZmLWJlN2UtN2ZlOGVkZmViZmY1IiwiZmlyc3ROYW1lIjoiTW91c3NhIiwibGFzdE5hbWUiOiJTYWlkaSIsInVzZXJuYW1lIjoic2FpZGkiLCJlbWFpbCI6Im1vdXNzYS5zYWlkaS4wMUBnbXppbC5jb20iLCJwYXNzd29yZCI6ImFkbWluMTIzNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc0Mjk1MjMyNn0.1s_IWO-h-AKwkP0LIX8mcjdeLRwsRtgbqAchIJSRVEA'; // Replace with your actual JWT token

// Function to create a new patient
async function createPatient(formData) {
    try {
        console.log('Form Data:', formData);
        console.log('API URL:', `${API_BASE_URL}/create-patient`);
        const response = await fetch(`${API_BASE_URL}/create-patient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_JWT_TOKEN`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Patient record created successfully!');
            return await response.json();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error creating patient record:', error);
        alert('An error occurred while creating the patient record.');
    }
}

// Function to get a patient by CIN
async function getPatientByCIN(cin) {
    try {
        const response = await fetch(`${API_BASE_URL}/get-patient?cin=${cin}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error fetching patient record:', error);
        alert('An error occurred while fetching the patient record.');
    }
}

// Function to update a patient record
async function updatePatient(cin, formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/update-patient?cin=${cin}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT_TOKEN}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Patient record updated successfully!');
            return await response.json();
        } else {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error updating patient record:', error);
        alert('An error occurred while updating the patient record.');
    }
}

// Example usage:
// Hook these functions to your form submissions in the respective HTML files
// Example for create form:
// document.getElementById('create-patient-form').addEventListener('submit', async function(event) {
//     event.preventDefault();
//     const formData = {
//         nom: document.getElementById('nom').value,
//         prenom: document.getElementById('prenom').value,
//         // Add other fields here...
//     };
//     await createPatient(formData);
// });