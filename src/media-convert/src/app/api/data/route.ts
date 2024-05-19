import { NextApiRequest, NextApiResponse } from 'next'
import {getLPStats} from "~/dal/stats";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const stats = await getLPStats()
    res.status(200).json(stats)
}

export default handler
