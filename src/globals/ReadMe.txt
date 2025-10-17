Steps to Configure Global Controls in Your React Project
---------------------------------------------------------

1. Copy Global Files
   - Copy and paste the entire **`globals`** folder into your project’s **`src/`** directory.

2. Update TypeScript Configuration
   - Open your **`tsconfig.json`** file and update the **`include`** section as shown below:

    "include": [
        "src",
        "src/globals/global.d.ts"
    ]