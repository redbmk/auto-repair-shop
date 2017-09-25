import moment from 'moment';

export default moment;

export const serverDate = 'YYYYMMDD';
export const serverTime = 'HH:mm';

export const localeDate = 'll';
export const localeTime = 'LT';
export const localeDateTime = 'lll';

export const asDate = date => moment(date, serverDate);
export const asTime = time => moment(time, serverTime);
export const asDateTime = datetime => moment(datetime);

export const formatDate = date => moment(date, serverDate).format(localeDate);
export const formatTime = time => moment(time, serverTime).format(localeTime);
export const formatDateTime = datetime => moment(datetime).format(localeDateTime);

export const serializeDate = date => moment(date, serverDate).format(serverDate);
export const serializeTime = time => moment(time, serverTime).format(serverTime);
export const serializeDateTime = datetime => +moment(datetime);
