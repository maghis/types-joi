# types-joi

TypeScript definitions for joi (Object schema description language and validator for JavaScript objects) https://github.com/hapijs/joi

# Getting started

Install `joi` and `types-joi`:

```
npm i joi types-joi
```

Use it:

```ts
import * as joi from "types-joi";
import { InterfaceFrom } from "types-joi";

const messageSchema = joi.object({
    status: joi.number().required(),
    body: joi.string()
}).required();

type Message = InterfaceFrom<typeof messageSchema>;

function processMessage(message: Message) {
    if (message.body) message.body.length;
}

const validatedMessage = joi.attempt({ some: "value" }, messageSchema);

processMessage(validatedMessage);
```
