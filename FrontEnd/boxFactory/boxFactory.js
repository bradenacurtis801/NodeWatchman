class BoxContainerManager {
    constructor() {
        this.rows = []; // Now stores RowContainer instances
        this.rowMap = {}; // Efficiently maps row labels to RowContainer instances
        this.root = document.getElementById('boxFactoryRoot');
        this.initializeContainer();
    }

    initializeContainer() {
        // Similar to RackContainer but adapted for row-level organization
        if (!this.root) {
            console.error(`Section with ID '${this.sectionId}' not found.`);
            return;
        }

        // Assuming rowContainer is the main container for this row
        // this.container = document.createElement('div');
        // this.container.className = 'box-manager-container';
        // this.root.appendChild(this.container);

        this.createHeader();
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'manager-container-header';
        // Dynamically create the header text to include row and rack labels
        header.textContent = ``;
        this.root.appendChild(header);

        // Create and append "Select All" button
        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = ''
        selectAllBtn.id = 'selectAllBtn'
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.addEventListener('click', () => this.selectAllBoxes());
        header.appendChild(selectAllBtn);

        // Create and append "Clear" button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => this.clearAllSelection());
        header.appendChild(clearBtn);
    }
    createRowContainer(sectionId, rowLabel, RowContainerClass = RowContainerBase, ...additionalArgs) {
        // Ensure the row label is unique to avoid duplicates
        if (this.rowMap[rowLabel]) {
            console.warn(`Row ${rowLabel} already exists.`);
            return; // Stop execution if the row already exists
        }

        // Dynamically create an instance of the provided RowContainerClass
        // The constructor of RowContainerClass should be designed to accept sectionId and rowLabel as its first two parameters
        // followed by any additional arguments that might be specific to the specialized class
        const rowContainerInstance = new RowContainerClass(sectionId, rowLabel, ...additionalArgs);
        this.container.appendChild(rowContainerInstance.container);
        // Store the newly created instance in both rows array and rowMap for quick access
        this.rows.push(rowContainerInstance);
        this.rowMap[rowLabel] = rowContainerInstance;
    }

    getRow(rowLabel) {
        // Return the row if it exists, otherwise return undefined
        return this.rowMap[rowLabel];
    }

    updateAllBoxBehaviors(eventHandlers) {
        this.rows.forEach(row => row.updateAllBoxBehaviors(eventHandlers));
    }

    getInfoAll() {
        return this.rows.reduce((acc, row) => acc.concat(...row.getInfoRow()), []);
    }

    getObjAll() {
        const allObjects = [];
        this.rows.forEach(row => {
            allObjects.push(...row.getObjRow());
        });
        return allObjects;
    }

    getIpAll() {
        const allIps = [];
        this.rows.forEach(row => {
            allIps.push(...row.getIpRow());
        });
        return allIps;
    }

    selectAllBoxes() {
        this.rows.forEach(row => row.selectAllRowBoxes());
    }
    
    clearAllSelection() {
        this.rows.forEach(row => row.clearRowSelection())
    }

}

class RowContainerBase {
    constructor(sectionId, rowLabel) {
        this.sectionId = sectionId;
        this.rowLabel = rowLabel;
        this.racks = []; // This will store RackContainer instances
        this.initializeContainer();
    }

    initializeContainer() {
        this.sectionContainer = document.createElement('div');
        this.sectionContainer.className = 'section';
        this.sectionContainer.id = this.sectionId

        // Assuming rowContainer is the main container for this row
        this.rowContainer = document.createElement('div');
        this.rowContainer.className = 'row-container';
        this.rowContainer.setAttribute('data-row', this.rowLabel);
        this.sectionContainer.appendChild(this.rowContainer);

        this.createHeader();
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'row-container-header';
        // Dynamically create the header text to include row and rack labels
        header.textContent = `Section: ${this.rowLabel}`;
        this.container.appendChild(header);

        // Create and append "Select All" button
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.addEventListener('click', () => this.selectAllRowBoxes());
        header.appendChild(selectAllBtn);

        // Create and append "Clear" button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => this.clearRowSelection());
        header.appendChild(clearBtn);
    }

    addRack(rackLabel, defaultBoxCount = 20, RackContainerClass=RackContainerBase, ...additionalArgs) {
        // Dynamically create an instance of the provided RackContainerClass
        // The constructor of RackContainerClass should be designed to accept sectionId, rowLabel, and rackLabel as its first three parameters
        // followed by any additional arguments that might be specific to the specialized class
        const rack = new RackContainerClass(this.sectionId, this.rowLabel, rackLabel, defaultBoxCount, ...additionalArgs);
        this.container.appendChild(rack.container);
        this.racks.push(rack);
    }

    updateAllBoxBehaviors(eventHandlers) {
        this.racks.forEach(rack => rack.updateAllBoxBehaviors(eventHandlers));
    }

    getObjRow() {
        let objRow = [];
        this.racks.forEach(rack => {
            objRow.push(...rack.getObjects());
        });
        return objRow;
    }

    getInfoRow() {
        const rowInfo = [];
        this.racks.forEach(rack => {
            rowInfo.push(...rack.getInfoRack());
        });
        return rowInfo;
    }

    getIpRow() {
        let ipRow = [];
        this.racks.forEach(rack => {
            ipRow.push(...rack.getIpRack());
        });
        return ipRow;
    }

    selectAllRowBoxes() {
        this.racks.forEach(rack => rack.selectAllRackBoxes());
    }
    
    clearRowSelection() {
        this.racks.forEach(rack => rack.clearRackSelection());
    }

}

class RackContainerBase {
    constructor(sectionId, rowLabel, rackLabel, defaultBoxCount = 20) {
        this.sectionId = sectionId;
        this.rowLabel = rowLabel;
        this.rackLabel = rackLabel;
        this.selectedBoxes = new Set(); // To track selected boxes
        this.defaultBoxCount = defaultBoxCount;
        this.boxes = []; // Store box instances
        this.initializeContainer();
        this.createDefaultBoxes();
    }

    initializeContainer() {
        const section = document.getElementById(this.sectionId);
        if (!section) {
            console.error(`Section with ID '${this.sectionId}' not found.`);
            return;
        }
    
        let rowContainer = section.querySelector(`.${this.rowLabel}-row-container`);
        if (!rowContainer) {
            rowContainer = document.createElement('div');
            rowContainer.className = `${this.rowLabel}-row-container row-container`;
            rowContainer.setAttribute('data-row', this.rowLabel);
            section.appendChild(rowContainer);
        }
    
        this.container = document.createElement('div');
        this.container.className = 'rack-container';
        rowContainer.appendChild(this.container);
    
        this.createHeader();
        this.createBoxesContainer();
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'box-container-header';
        this.container.appendChild(header);
        console.log('not implemented');
    }

    createBoxesContainer() {
        this.boxesContainer = document.createElement('div');
        this.boxesContainer.className = 'boxes-container'; // Ensure this line is correctly assigning the class
        this.container.appendChild(this.boxesContainer);
    }

    createDefaultBoxes() {
        for (let i = 1; i <= this.defaultBoxCount; i++) {
            this.addBox(i, { });
        }
    }

    addBox(index, eventHandlers = {}) {
        const box = new Box(this.rowLabel, this.rackLabel, index, eventHandlers);
        this.boxesContainer.appendChild(box.element);
        this.boxes.push(box);
    }

    updateAllBoxBehaviors(eventHandlers) {
        this.boxes.forEach(box => box.updateEventHandlers(eventHandlers));
    }

    setBoxCount(newCount) {
        const currentCount = this.boxes.length;
        if (newCount > currentCount) {
            // Add more boxes if newCount is greater than currentCount
            for (let i = currentCount + 1; i <= newCount; i++) {
                this.addBox(i, {click: () => console.log(`Box ${i} clicked`)});
            }
        } else if (newCount < currentCount) {
            // Remove boxes if newCount is less than currentCount
            for (let i = currentCount; i > newCount; i--) {
                const boxToRemove = this.boxes.pop();
                boxToRemove.element.remove(); // Assuming element is the DOM element of the box
            }
        }
    }

    getObjects() {
        return this.boxes;
    }

    getInfoRack() {
        const rackInfo = [];
        this.boxes.forEach(box => {
            rackInfo.push(box.getInfo());
        });
        return rackInfo;
    }

    getIpRack() {
        const rackInfo = [];
        this.boxes.forEach(box => {
            rackInfo.push(box.getIp());
        });
        return rackInfo;
    }
}

class Box {
    constructor(rowLabel, rackLabel, index, eventHandlers = {}) {
        this.rowLabel = rowLabel;
        this.rackLabel = rackLabel;
        this.index = index;
        this.id = `${rowLabel}-${rackLabel}-${index}`;
        this.ip = this.generateMachineIP();
        this.element = this.createElement();
        this.setEventHandlers(eventHandlers);
    }

    generateMachineIP() {
        const networkBase = "10.10"; // Assuming this method correctly formulates the IP
        return `${networkBase}.${this.rackLabel}.${this.index}`;
    }

    getIp() {
        return this.ip;
    }

    setIp(newIp) {
        const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/; // Regular expression for IPv4 validation
        if (ipRegex.test(newIp)) {
            this.ip = newIp;
        } else {
            console.error("Invalid IPv4 address format");
            // Optionally, you can throw an error or handle the invalid input differently
        }
    }

    createElement() {
        const boxId = this.id;
        const box = document.createElement('div');
        box.className = 'box drag-selectable';
        box.id = boxId;
        box.textContent = this.index; // Assuming this sets the content correctly
        box.setAttribute('data-ip', this.generateMachineIP()); // Correctly storing the IP
        return box;
    }

    setEventHandlers(eventHandlers) {
        Object.keys(eventHandlers).forEach(eventType => {
            this.element.removeEventListener(eventType, this[eventType]); // Remove previous listener if any
            this[eventType] = eventHandlers[eventType]; // Store reference for removal
            this.element.addEventListener(eventType, this[eventType]);
        });
    }

    updateEventHandlers(eventHandlers) {
        this.setEventHandlers(eventHandlers);
    }

    getInfo() {
        const info = {};
        // Iterate over all properties of the instance
        Object.keys(this).forEach((key) => {
            // Add each property to the info object
            info[key] = this[key];
        });
        // Return the info within an object using the box's id as the key
        return { [this.id]: info };
    }

    // Method to add an arbitrary number of key-value pairs as properties
    addProperties(properties) {
        Object.entries(properties).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}

class SpecializedRackContainer extends RackContainerBase {
    constructor(sectionId, rowLabel, rackLabel, defaultBoxCount) {
        super(sectionId, rowLabel, rackLabel, defaultBoxCount);
        // Additional initialization for SpecializedRackContainer
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'box-container-header';
        // Dynamically create the header text to include row and rack labels
        header.textContent = `Row: ${this.rowLabel} Rack: ${this.rackLabel}`;
        this.container.appendChild(header);

        // Create and append "Select All" button
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.addEventListener('click', () => this.selectAllRackBoxes());
        header.appendChild(selectAllBtn);

        // Create and append "Clear" button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => this.clearRackSelection());
        header.appendChild(clearBtn);
    }

    // Override addBox to include specialized behavior
    addBox(index, eventHandlers = {}) {
        // Assuming super.addBox adds the box object to this.boxes
        const boxObject = super.addBox(index, {
            ...eventHandlers,
            click: (event) => {
                // Assuming the box object is stored in the dataset or accessible directly
        	const currentIndex = this.boxes.findIndex(box => box.element === event.currentTarget);
                this.toggleSelection(event.currentTarget, this.boxes[currentIndex]);
                console.log(`Specialized box ${index} clicked`);
                eventHandlers.click?.(event);
            }
        });
    }

    toggleSelection(boxElement, boxObject) {
        const isSelected = boxElement.classList.toggle('drag-selected');
        if (isSelected) {
            this.selectedBoxes.add(boxObject); // Use the box object for selection tracking
        } else {
            this.selectedBoxes.delete(boxObject);
        }
        console.log(this.selectedBoxes);
    }

    selectAllRackBoxes() {
        this.boxes.forEach(box => {
            box.element.classList.add('drag-selected');
            this.selectedBoxes.add(box); // Directly add the box object
            console.log(this.selectedBoxes);
        });
    }

    clearRackSelection() {
        this.selectedBoxes.forEach(box => {
            box.element.classList.remove('drag-selected');
        });
        this.selectedBoxes.clear();
        console.log(this.selectedBoxes);
    }
}


