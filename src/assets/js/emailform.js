function HandleSubmit(e) {
  e?.preventDefault();
  const name = document.getElementById('name').value.toString();
  const emailaddress = document.getElementById('emailaddress').value.toString();
  const message = document.getElementById('message').value.toString();
  sendEmail(name, emailaddress, message);
}

function sendEmail(name, email="", message="") {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            email: email,
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
        } else {
          feedback="Problème: message non envoyé :(";
        }
        document.getElementById('feedback').replaceChildren(feedback);
        setTimeout(() => document.getElementById('mailform').classList.add("rollup"), 2000);
        setTimeout(() => document.getElementById('feedback').classList.remove("rollup"), 3800);
    })
    .catch(error => console.error("sendEmail", error))
}

document.getElementById("contactForm").addEventListener("submit", HandleSubmit);
