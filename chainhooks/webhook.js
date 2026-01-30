import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('📡 Chainhook event received');
  console.dir(req.body, { depth: null });

  // TODO:
  // - store task events
  // - update frontend cache
  // - emit websocket updates

  res.sendStatus(200);
});

app.listen(3999, () => {
  console.log('🚀 Chainhook webhook listening on 3999');
});
