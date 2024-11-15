const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');
const loader = document.getElementById('loader');
const musicLoader = document.getElementById('music-loader');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hin-IN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

const botReply = (message, pitch = 4, volume = 4, rate = 0.9) => {
  const utterThis = new SpeechSynthesisUtterance(message);
  utterThis.pitch = pitch;
  utterThis.volume = volume;
  synth.speak(utterThis);
};

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  output.textContent = `You said: "${transcript}"`;

  if (transcript.includes("call")) {
    const contactName = transcript.replace("call", "").trim();
    botReply(`Searching contact details for ${contactName}`, 1, 1);
    try {
      const contactDetails = await fetchContactDetails(contactName);
      if (contactDetails) {
        botReply(`Calling ${contactName}`, 1, 1);
        // Simulate a call or use an API to initiate a call
        console.log(`Contact Name: ${contactDetails.name}, Number: ${contactDetails.phone}`);
      } else {
        botReply(`Sorry, I couldn't find contact details for ${contactName}`, 1, 1);
      }
    } catch (error) {
      botReply(`Error fetching contact details: ${error.message}`, 1, 1);
    }
  } else if (transcript === "who are you") {
    botReply("I am Atlas, and I can assist you by voice.", 1.2, 0.9);
  } else if (transcript === "hello") {
    botReply("Hello! How can I assist you?", 1, 1);
  } else if (transcript === "open youtube") {
    botReply("Opening YouTube", 1, 1);
    window.open("https://www.youtube.com", '_blank');
  } else if (transcript === "open facebook") {
    botReply("Opening Facebook", 1, 1);
    window.open("https://www.facebook.com", '_blank');
  } else {
    botReply(`Searching for ${transcript}`, 1, 1);
    window.open(`https://www.google.com/search?q=${transcript}`, '_blank');
  }
};

recognition.onerror = (event) => {
  output.textContent = 'Error occurred in recognition: ' + event.error;
};

startBtn.addEventListener('click', () => {
  recognition.start();
  output.textContent = 'Listening...';
  loader.style.display = 'flex';
  musicLoader.play();
});

recognition.onend = () => {
  loader.style.display = 'none';
  musicLoader.pause();
  musicLoader.currentTime = 0;
};

// Function to fetch contact details using Google Contacts API
const fetchContactDetails = async (contactName) => {
  const apiKey = "AIzaSyDVy_QCjoeQNW41MxD2KNPDI8oRn6-l54U";
  const url = `https://people.googleapis.com/v1/people:searchContacts?query=${contactName}&key=${apiKey}&readMask=names,phoneNumbers`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${your_oauth_token}` // You need to replace with a valid OAuth token
    }
  });

  if (response.ok) {
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const contact = data.results[0].person;
      return {
        name: contact.names[0].displayName,
        phone: contact.phoneNumbers[0].value
      };
    } else {
      return null;
    }
  } else {
    throw new Error('Failed to fetch contact details');
  }
};
