import { ObjectOrType } from '@itrocks/class-type'
import { decorate }     from '@itrocks/decorator/property'
import { decoratorOf }  from '@itrocks/decorator/property'

const UNIT = Symbol('unit')

export function Unit<T extends object>(value: string)
{
	return decorate<T>(UNIT, value)
}

export function unitOf<T extends object>(target: ObjectOrType<T>, property: keyof T)
{
	return decoratorOf<string | undefined, T>(target, property, UNIT, undefined)
}
