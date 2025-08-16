import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

import * as functions from 'firebase-functions'
import fetch from 'node-fetch'
import cors from 'cors'

const corsHandler = cors({ origin: true })

export const klines = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { symbol = 'BTCUSDT', interval = '1h', limit = '750' } = req.query
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      const r = await fetch(url)
      if (!r.ok) return res.status(r.status).send(await r.text())
      const data = await r.json()
      res.set('Cache-Control', 'public, max-age=60') // 1 хв кеш
      res.status(200).json(data)
    } catch (e: any) {
      res.status(500).json({ error: e?.message ?? 'unknown error' })
    }
  })
})
