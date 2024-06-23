document.addEventListener('DOMContentLoaded', () => {
  const dataOutput = document.getElementById('data-output');
  const loginButton = document.getElementById('loginButton');
  let truePassword = ""; // Utilizziamo let invece di var
  var loggedIn = false;

  // Funzione per effettuare il login e ottenere il token di accesso
async function loginMongoDB() {
    const loginUrl = 'https://eu-central-1.aws.services.cloud.mongodb.com/api/client/v2.0/app/data-seigqtz/auth/providers/local-userpass/login';
    const loginData = {
      username: 'fiscaletti.gianluca@gmail.com',
      password: 'Barsport1!',
    };

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      const accessToken = result.access_token;
      textContent = 'Login successful';
      return accessToken;
    } catch (error) {
      textContent = `Login error: ${error.message}`;
    }
  }

  // Funzione per recuperare i dati da MongoDB
  async function fetchData(accessToken, user) {
    let textContent = "";
    const fetchUrl = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-seigqtz/endpoint/data/v1/action/findOne';
    const fetchData = {
      collection: 'tokens',
      database: 'peccataIustiniani',
      dataSource: 'Cluster0',
      filter: { username: user },
      projection: { _id: 0, token: 1, password: 1 }, // Include il campo password nella proiezione
    };

    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(fetchData),
      });

      if (!response.ok) {
        throw new Error('Data fetch failed');
      }

      const result = await response.json();
      if (result.document) {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var currentTime = (hours < 10 ? "0" : "") + hours + (minutes < 10 ? "0" : "") + minutes;
        textContent = `${result.document.password}${currentTime}`;
      } else {
        textContent = 'Nessun dato trovato per l\'utente specificato';
      }
    } catch (error) {
      textContent = `Fetch error: ${error.message}`;
    }
	return textContent;
  }

  function doLogin(truePassword,password){
	  if(truePassword == password){
			loggedIn= true;
			console.log("Accesso effettuato");
		}
	}


	loginButton.addEventListener('click', async () => {
		const user = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		const token = await loginMongoDB();
		if (token && user != "" && password != "") {
			//truePassword = await fetchData(token, user); // Attendiamo che fetchData sia completato
			doLogin(await fetchData(token, user),password);
			if(loggedIn == true){
				window.location.href ="https://wodwikiperdia.github.io/firstLoad.html"  
			}
		}
	});

  });