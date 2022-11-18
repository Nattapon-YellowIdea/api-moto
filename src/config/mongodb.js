import mongoose from 'mongoose';

export default mongoose.connect(`${process.env.DB_PROTOCAL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?${process.env.DB_OPTION}`);
