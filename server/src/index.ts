import app from './app.js';
import { PORT } from './config/constants.js';
import './config/database.js';

app.listen(PORT, () => {
  console.log(`BookWise server running on http://localhost:${PORT}`);
});
