/**
 * createElement - description
 *
 * @param  {string} tag    Тег дом ноды
 * @param  {Object} props  Атрибуты дом элемента как объект
 * @param  {...DOMNode}   ...children Внутрение DOM элемент
 * @return {type}         DOM элемент
 */
export default function createElement(tag, props, ...children) {
  const element = document.createElement(tag);

  Object.keys(props).forEach((key) => {
    element[key] = props[key];
  });

  children.forEach((child) => {
    let localChild = child;
    if (typeof child === 'string') {
      localChild = document.createTextNode(child);
    }

    element.appendChild(localChild);
  });

  return element;
}
