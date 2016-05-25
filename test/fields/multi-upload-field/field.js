import test from 'tape'
import React from 'react'
import shallowRenderComponent from '../../fixtures/shallow-render.js'

// local module
import Input from '../../../src/components/fields/multi-upload-field'

const props = {
  hint: 'foo',
  label: 'bar',
  name: 'baz',
  attributes: {
    inline: true
  }
}

test('File Upload:', (nest) => {
  nest.test('...is a valid component', (t) => {
    const component = shallowRenderComponent(Input, props)
    const actual = React.isValidElement(component)
    t.ok(actual, 'component is valid')
    t.end()
  })

  nest.test('...children has children', (t) => {

    // this is what 'children' looks like:
    // <FieldHeader/>
    // null (XHRErrorMessages)
    // null (invalidFiles)
    // <Dropzone/>

    const component = shallowRenderComponent(Input, props)
    const actual = component.props.children.props.children.length
    const expected = 4
    t.equal(actual, expected)
    t.end()
  })
})
