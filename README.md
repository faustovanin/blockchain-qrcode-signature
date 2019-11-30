# Blockchain Crypto Signature using QR Code
A POC for cryptographic signature using Node.JS Express API, Web3 and QR Code Scanner.


It is composed by {

	an HTML page A has its QR Code read by another {

		HTML page B that reads the QR Code and do a POST to an {

			API endpoint that sends a transaction to a {

				Smart Contract that generates an event, monitored by a {

					Websocket API that notifies HTML page A

				}

			}

		}

	}

# Instalation

``npm i``

``npm start``

In a different terminal run:
``node ws/index.js``

You'll need to setup manually your directory into ``docs/sign.html`` to point to your local IP addres.

# Usage

Go to ``hostname:5000`` in your local browser and access ``hostname:5000/sign.html`` on your smartphone (both on the same network, obviously).