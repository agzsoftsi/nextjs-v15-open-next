export default {
  // Directorio de salida del build
  outDir: ".open-next",

  // Define el runtime serverless a usar
  // Ejemplo: AWS Lambda, Cloudflare Workers, Netlify, etc.
  default: {
    runtime: "aws-lambda",
  },

  // Puedes incluir variables o adaptadores específicos
  awsLambda: {
    functionName: "nextjs-v15-open-next",
    memory: 512,
    timeout: 10,
  },
};
