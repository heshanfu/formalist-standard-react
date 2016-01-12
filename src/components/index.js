import fields from './fields'
import {AttrFactory} from './attr'
import {GroupFactory} from './group'
import {ManyFactory} from './many'
import {SectionFactory} from './section'

export default {
  fields,
  attr: AttrFactory,
  group: GroupFactory,
  many: ManyFactory,
  section: SectionFactory
}
