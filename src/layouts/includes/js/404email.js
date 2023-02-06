function makeNotice() {
  const url = window.location.href;
  const referer = Document.referrer;
  console.log(url);
  console.log("sendEmail");
  sendEmail("404", "alx@lib.re", "404 not found on: " + url + "\n\n and referer = " + referer);
}

function sendEmail(name, email, message) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
    };

    var feedback;
    fetch("/api/envoi.php", options)
    .then(response => response.json())
    .then(data => {
        if (data.status === 201) {
          feedback="📨 message envoyé. 😘 Merci !";
        } else {
          feedback="⚠️ Problème: message non envoyé :(";
        }
    })
    .catch(error => console.error("error sendEmail", error))
}
