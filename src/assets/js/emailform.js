function HandleSubmit(e) {
  e?.preventDefault();
  const name = document.getElementById('name').value;
  const emailaddress = document.getElementById('emailaddress').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  sendEmail(name, email, subject, message);
}

function sendEmail(name, email, message) {
  console.log("sendEmail");
    const options = {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
        }),
        headers: { 'Content-Type': 'application/json' }
    }

    var feedback;
    fetch("/api/envoi.php", options)
    .then(response => response.json())
    .then(data => {
        if (data.status === 201) {
          feedback="\o/ message envoyé. Merci !";
          setTimeout(() => document.getElementById('contactForm').className = "hidden", 2000);
          setTimeout(() => document.getElementById('feedback').className = "", 3800);
        } else {
            feedback="Problème: message non envoyé :(";
            setTimeout(() => document.getElementById('contactForm').className = "hidden", 2000);
            setTimeout(() => document.getElementById('feedback').className = "", 5800);
        }
        console.log(feedback);
    })
    .catch(error => console.error("sendEmail", error))
}

document.getElementById("contactForm").addEventListener("submit", HandleSubmit);
