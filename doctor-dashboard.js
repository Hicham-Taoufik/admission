const API_BASE_URL = 'https://workflows.aphelionxinnovations.com/webhook';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiZmJmMmI1ZjctZTc3ZS00ZGZmLWJlN2UtN2ZlOGVkZmViZmY1IiwiZmlyc3ROYW1lIjoiTW91c3NhIiwibGFzdE5hbWUiOiJTYWlkaSIsInVzZXJuYW1lIjoic2FpZGkiLCJlbWFpbCI6Im1vdXNzYS5zYWlkaS4wMUBnbXppbC5jb20iLCJwYXNzd29yZCI6ImFkbWluMTIzNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc0Mjk1MjMyNn0.1s_IWO-h-AKwkP0LIX8mcjdeLRwsRtgbqAchIJSRVEA'; // Replace with your actual JWT token

// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch and display patient details
async function preloadPatientDetails() {
    const ipp = getQueryParam('ipp'); // Get IPP from the URL
    console.log('IPP from URL:', ipp); // Log the IPP
    if (ipp) {
        try {
            const patientDetails = await getPatientByIPP(ipp); // Fetch patient details
            if (patientDetails) {
                // Display patient details
                document.getElementById('patient-details').classList.remove('hidden');
                document.getElementById('patient-details').innerHTML = `
                    <h3>Patient Information</h3>
                    <p><strong>Nom:</strong> ${patientDetails.nom}</p>
                    <p><strong>Prénom:</strong> ${patientDetails.prenom}</p>
                    <p><strong>CIN:</strong> ${patientDetails.cin}</p>
                    <p><strong>Téléphone:</strong> ${patientDetails.telephone}</p>
                    <p><strong>Adresse:</strong> ${patientDetails.adresse}</p>
                    <p><strong>Ville:</strong> ${patientDetails.ville}</p>
                    <p><strong>Date de Naissance:</strong> ${patientDetails.date_naissance}</p>
                    <p><strong>Sexe:</strong> ${patientDetails.sexe}</p>
                    <p><strong>Mutuelle:</strong> ${patientDetails.mutuelle || 'N/A'}</p>
                `;

                // Preload IPP into forms
                document.getElementById('submit-diagnostic-form').dataset.ipp = ipp;
                document.getElementById('validate-prescription-form').dataset.ipp = ipp;
            } else {
                document.getElementById('patient-details').innerHTML = `
                    <p class="error">No patient found with IPP: ${ipp}</p>
                `;
            }
        } catch (error) {
            console.error('Error fetching patient details:', error);
            document.getElementById('patient-details').innerHTML = `
                <p class="error">An error occurred while fetching patient details.</p>
            `;
        }
    } else {
        document.getElementById('patient-details').innerHTML = `
            <p class="error">No IPP provided in the URL.</p>
        `;
    }
}

// Function to get patient details by IPP
async function getPatientByIPP(ipp) {
    console.log('Fetching patient details for IPP:', ipp); // Log the IPP
    try {
        const response = await fetch(`${API_BASE_URL}/doctor-get-patient?ipp=${ipp}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`
            }
        });

        console.log('API Request URL:', `${API_BASE_URL}/doctor-get-patient?ipp=${ipp}`); // Log the request URL
        console.log('API Response Status:', response.status); // Log the response status

        if (response.ok) {
            const data = await response.json();
            console.log('API Response Data:', data); // Log the response data
            return data;
        } else {
            const errorData = await response.json();
            console.error('API Error:', errorData); // Log the error response
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error fetching patient details:', error); // Log the error
        alert('An error occurred while fetching patient details.');
    }
}

// Function to submit a diagnostic
async function submitDiagnostic(event) {
    event.preventDefault();
    const form = event.target;
    const ipp = form.dataset.ipp; // Get IPP from the form's dataset
    const diagnostic = document.getElementById('diagnostic').value;

    try {
        const response = await fetch(`${API_BASE_URL}/doctor-submit-diagnostic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT_TOKEN}`
            },
            body: JSON.stringify({ ipp, diagnostic })
        });

        if (response.ok) {
            alert('Diagnostic submitted successfully!');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error submitting diagnostic:', error);
        alert('An error occurred while submitting the diagnostic.');
    }
}

// Function to validate a prescription
async function validatePrescription(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/doctor-validate-prescription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT_TOKEN}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Prescription validated successfully!');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error validating prescription:', error);
        alert('An error occurred while validating the prescription.');
    }
}

// Function to get patient history
async function getPatientHistory(ipp) {
    try {
        const response = await fetch(`${API_BASE_URL}/patient-history?ipp=${ipp}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error fetching patient history:', error);
        alert('An error occurred while fetching patient history.');
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.className = type; // 'success' or 'error'
    notification.innerText = message;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);
}

// Clear Form Functionality
function clearForm(formId) {
    document.getElementById(formId).reset();
}

// Event Listeners for Clear Buttons
document.getElementById('clear-search').addEventListener('click', () => clearForm('search-patient-form'));
document.getElementById('clear-diagnostic').addEventListener('click', () => clearForm('submit-diagnostic-form'));
document.getElementById('clear-prescription').addEventListener('click', () => clearForm('validate-prescription-form'));
document.getElementById('clear-history').addEventListener('click', () => clearForm('patient-history-form'));

// Event listeners for forms
document.getElementById('search-patient-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const ipp = document.getElementById('ipp').value;
    try {
        const patientDetails = await getPatientByIPP(ipp);
        if (patientDetails) {
            document.getElementById('patient-details').classList.remove('hidden');
            document.getElementById('patient-details').innerHTML = `
                <h3>Patient Information</h3>
                <p><strong>Nom:</strong> ${patientDetails.nom}</p>
                <p><strong>Prénom:</strong> ${patientDetails.prenom}</p>
                <p><strong>CIN:</strong> ${patientDetails.cin}</p>
                <p><strong>Téléphone:</strong> ${patientDetails.telephone}</p>
                <p><strong>Adresse:</strong> ${patientDetails.adresse}</p>
                <p><strong>Ville:</strong> ${patientDetails.ville}</p>
                <p><strong>Date de Naissance:</strong> ${patientDetails.date_naissance}</p>
                <p><strong>Sexe:</strong> ${patientDetails.sexe}</p>
                <p><strong>Mutuelle:</strong> ${patientDetails.mutuelle || 'N/A'}</p>
            `;
            showNotification('Patient details fetched successfully!', 'success');
        } else {
            showNotification('No patient found with the provided IPP.', 'error');
        }
    } catch (error) {
        console.error('Error fetching patient details:', error);
        showNotification('An error occurred while fetching patient details.', 'error');
    }
});

document.getElementById('submit-diagnostic-form').addEventListener('submit', submitDiagnostic);

document.getElementById('validate-prescription-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = {
        ipp: document.getElementById('prescription-ipp').value,
        final_prescription: document.getElementById('final-prescription').value,
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value
    };
    await validatePrescription(formData);
});

document.getElementById('patient-history-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const ipp = document.getElementById('history-ipp').value;
    const history = await getPatientHistory(ipp);
    document.getElementById('patient-history').innerText = JSON.stringify(history, null, 2);
});

// Call the preload function on page load
window.onload = preloadPatientDetails;