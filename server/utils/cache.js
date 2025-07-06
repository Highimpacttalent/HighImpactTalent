import NodeCache from "node-cache";

// Cache expires in 300 seconds (5 minutes)
const cache = new NodeCache({ stdTTL: 300 });

export default cache;
