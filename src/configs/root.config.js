import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
    port: process.env.PORT || 3000,
    match_players: process.env.MATCH_PLAYERS,
    min_bigs: process.env.MIN_BIGS,
    match_time: process.env.MATCH_TIME,
    num_maps: process.env.NUM_MAPS,
}

export {envConfig}