// "check-api": "tsc -noEmit --project app/tsconfig.json && tsc -noEmit --project dom/tsconfig.json && tsc -noEmit --project style/tsconfig.json"

import { typecheck } from "./typecheck.mjs";

typecheck('api/app/tsconfig.json');
typecheck('api/style/tsconfig.json');
typecheck('api/dom/tsconfig.json');
