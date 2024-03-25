// Define a decorator function
function myDecorator(target) {
    target.myProperty = 'Hello World!';
  }
  // Define a class and apply the decorator
  @myDecorator
  class MyClass {}
  // Access the decorated property
  console.log(MyClass.myProperty); // Output: Hello World!