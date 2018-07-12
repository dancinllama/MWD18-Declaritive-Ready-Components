# MWD18-Declaritive-Ready-Components
Example component(s) for the Midwest Dreamin 18 talk on "Writing Declaritive Ready Components"

For more on the talk, go to: http://midwestdreamin.com/sessions/writing-declarative-ready-components/

## Getting Started
To get started, clone this repoistory and deploy to a Salesforce DX Scratch org, or you can click the Deploy to DX button below and log in with your DX Enviornmnet to spin up a scratch org with the code installed.

[![Deploy](https://deploy-to-sfdx.com/dist/assets/images/DeployToSFDX.svg)](https://deploy-to-sfdx.com/)

## Enabling The Dynamic Design Attributes
The dynamic design attributes in this component use callouts using the Salesforce REST API and need the following configured:
* Connected App
* Auth Provider
* Named Credential

### Connected App
* This project comes with a pre-installed connected app, called Salesforce REST API Sandbox.
* Open the connected app by going to Setup->Apps->App Manager and clicking "View" next to the connected app.
* Copy the consumer key and client secret, as we'll use those later.

## Auth Provider
* Next, you'll need to create an auth provider
* Open a new tab / window with Salesforce
* Go to Setup->Identity->Auth Provders and click new.
* Name the provider "Salesforce REST API Sandbox"
* Paste the consumer key and client secret from the connected app.
* For scopes: specify refresh_token api
* Click Save.
* You should come to the Auth Provider Detail Screen.
* From this detail screen, copy the "Callback URL" in the Salesforce Configuration section.

## Connected App (Again)
* Back in the connected app, paste the Callback URL from the Auth Provider into the Callback URL in the connected app and save.

## Named Credential
* Go to Setup->Security-Named Credential and click "New Named Credential"
* Specify "Salesforce REST API Sandbox" for the Name.
* Paste the callback url (sans the callback path) into the URL field.  (For instance https://yourscratchorgname-dev-ed.cs52.my.salesforce.com)
* Choose "Named Principal" for the Identity Type
* Choose OAuth 2.0 for the Protocol
* Click on the Auth Provider lookup and select Salesforce REST API Sandbox
* Specify api refresh_token for the scope.
* Make sure "Start Authentication Flow on Save" is checked.
* Click Save.  This will open a Salesforce Login screen.  

## Salesforce DX
To complete the named credential set up, you'll need to create a password for your scratch org.
* To do this, issue the command:

sfdx force:user:password:generate --targetusername <yourscratchorgaliasgoeshere>
  
* Copy and paste the username and password into the login form. 

After completing these steps, you should be able to see your scratch org's list views in the lightning app builder.

If you're looking for better instructions and screenshots :) please see an etter tutorial on this setup here: https://www.gscloudsolutions.com/blogpost/Using-Named-Credentials-with-the-Apex-Wrapper-Salesforce-Metadata-API-apex-mdapi?blogpost=true 



## Use the component
Once you've configured the named credential, connected app, and auth provider, then drag and drop the "SuperLightningListBuilder" onto a Lightning Page or Community Page using Ligtning App Builder or Community Builder.
