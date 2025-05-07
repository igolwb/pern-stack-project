// configurando o arcjet para prevenção de bots e usuarios maliciosos

import arcjet, { tokenBucket, shield, detectBot} from "@arcjet/node";
import "dotenv/config";

// iniciando o arcjet
export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: [ip.src],
        rules: [
            shield({mode:'LIVE'}),

            detectBot({mode:'LIVE',
                allow:[
                    "CATEGORY:SEARCH_ENGINE"
                ]}),
            tokenBucket({
                mode:"LIVE",
                refillRate: 10,
                interval: 10,
                capacity: 10,
            }),
        ]
    });