export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const token = process.env.BLYNK_AUTH_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'BLYNK_AUTH_TOKEN belum diset di Vercel' });
  }

  try {
    const [latRes, lngRes] = await Promise.all([
      fetch(`https://blynk.cloud/external/api/get?token=${token}&v5`),
      fetch(`https://blynk.cloud/external/api/get?token=${token}&v6`)
    ]);

    const lat = parseFloat(await latRes.text());
    const lng = parseFloat(await lngRes.text());

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(404).json({ error: 'Data GPS ESP32 belum tersedia' });
    }

    return res.status(200).json({ lat, lng });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data Blynk', detail: err.message });
  }
}
