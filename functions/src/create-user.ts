import * as functions from "firebase-functions";
import { auth, db } from "./init";
import { getUserCredentialsMiddleware } from "./auth.middleware";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

export const createUserApp = express();

createUserApp.use(bodyParser.json());
createUserApp.use(cors({origin: true}));
createUserApp.use(getUserCredentialsMiddleware);


createUserApp.post("/", async (req, res)=>{
    functions.logger.debug("Calling create user function.")

    try {
        //will be add from middleware by getUserCredentialsMiddleware()
        if (!(req["uid"] && req["admin"])) {
            const message = "Denied access to user creatin service";
            functions.logger.debug(message);
            res.status(403).json({message});
            return;
        }

        const email = req.body.email;
        const password = req.body.password;
        const admin = req.body.admin;

        const user = await auth.createUser({email, password});
        await auth.setCustomUserClaims(user.uid, {admin});

        db.doc(`users/${user.uid}`).set({});

        res.status(200).json({
            message: "User created successfully."
        });
    }
    catch(err) {
        functions.logger.error("Could not create user.", err);

        res.status(500).json({
            message: "Could not create user."
        });
    }
});
