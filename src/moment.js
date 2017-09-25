import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

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

export const dateTimeFormat = [ serverDate, serverTime ].join(' ');
export const dateTimeFromDateAndTime = (date, time) => {
  return moment([ serializeDate(date), serializeTime(time) ].join(' '), dateTimeFormat);
}

export const hourRange = ({ date, time }) => {
  const start = dateTimeFromDateAndTime(date, time);
  return moment.range(start, moment(start).add(1, 'hour'));
}
