import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import type { DateProps } from '../types';

/**
 * Formats the date in the "dd MMM yyyy" pattern
 * @param {string} date - Date in ISO format
 * @param {string} locale - Formatting language (default is "en-us")
 */
export function formatDate({ date, locale = 'en-us' }: DateProps) {
	return format(new Date(date), 'dd MMM yyyy', {
		locale: locale === 'en-us' ? enUS : ptBR
	});
}

/**
 * Formats the date in the full pattern, e.g., "MMMM dd yyyy" or "dd 'de' MMMM 'de' yyyy"
 * @param {string} date - Date in ISO format
 * @param {string} locale - Formatting language (default is "en-us")
 */
export function formatFullDate({ date, locale = 'en-us' }: DateProps) {
	const localePattern = locale === 'en-us' ? 'MMMM dd yyyy' : "dd 'de' MMMM 'de' yyyy";
	return format(new Date(date), localePattern, {
		locale: locale === 'en-us' ? enUS : ptBR
	});
}

/**
 * Formats the date with a full timestamp
 * @param {string} date - Date in ISO format
 * @param {string} locale - Formatting language (default is "en-us")
 */
export function formatFullTimeStamp({ date, locale = 'en-us' }: DateProps) {
	const localePattern =
		locale === 'en-us' ? "MMMM dd yyyy', at' H:mm" : "dd 'de' MMMM 'de' yyyy', às' H:mm";

	return format(new Date(date), localePattern, {
		locale: locale === 'en-us' ? enUS : ptBR
	});
}

/**
 * Formats the date in the "MMM yyyy" pattern
 * @param {string} date - Date in ISO format
 * @param {string} locale - Formatting language (default is "en-us")
 */
export function formatMonthYear({ date, locale = 'en-us' }: DateProps) {
	return format(new Date(date), 'MMM yyyy', {
		locale: locale === 'en-us' ? enUS : ptBR
	});
}
