async function loadJsonData() {
    try {
      const module = await import('./testNodeStatus.json', {
        assert: { type: 'json' }
      });
      const mappedArray = module.default;
      displayBashOutput(mappedArray); // This needs to be inside loadJsonData after you load the data
    } catch (error) {
      console.error('Failed to load JSON file:', error);
    }
  }
  
  loadJsonData(); // Call the function to load and display data