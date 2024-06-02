import _ from 'lodash';
export const pascalCase = (componentName) => {
  return _.upperFirst(_.camelCase(componentName.replace(/-/g, ' ')))
}