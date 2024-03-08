class BoxContainerManager {
    constructor() {
        this.rows = []; // Now stores RowContainer instances
        this.rowMap = {}; // Efficiently maps row labels to RowContainer instances
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
}

class RowContainerBase {
    constructor(sectionId, rowLabel) {
        console.log(`Creating RowContainer for section: ${sectionId}, row: ${rowLabel}`);
        this.sectionId = sectionId;
        this.rowLabel = rowLabel;
        this.racks = []; // This will store RackContainer instances
        this.initializeContainer();
    }

    initializeContainer() {
        // Similar to RackContainer but adapted for row-level organization
        const section = document.getElementById(this.sectionId);
        if (!section) {
            console.error(`Section with ID '${this.sectionId}' not found.`);
            return;
        }

        // Assuming rowContainer is the main container for this row
        this.container = document.createElement('div');
        this.container.className = 'row-container';
        this.container.setAttribute('data-row', this.rowLabel);
        section.appendChild(this.container);
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

    getInfoRow() {
        const rowInfo = [];
        this.racks.forEach(rack => {
            rowInfo.push(rack.getInfoRack());
        });
        return rowInfo;
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

    getInfoRack() {
        const rackInfo = [];
        this.boxes.forEach(box => {
            rackInfo.push(box.getInfo());
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
        this.ip = this.getMachineIP();
        this.element = this.createElement();
        this.setEventHandlers(eventHandlers);
    }

    getMachineIP() {
        const networkBase = "10.10"; // Assuming this method correctly formulates the IP
        return `${networkBase}.${this.rackLabel}.${this.index}`;
    }

    createElement() {
        const boxId = `${this.rowLabel}-${this.rackLabel}-${this.index}`;
        const box = document.createElement('div');
        box.className = 'box drag-selectable';
        box.id = boxId;
        box.textContent = this.index; // Assuming this sets the content correctly
        box.setAttribute('data-ip', this.getMachineIP()); // Correctly storing the IP
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
        return {
            [this.id]: {
                rowLabel: this.rowLabel,
                rackLabel: this.rackLabel,
                index: this.index,
                ip: this.ip
            }
        };
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
        selectAllBtn.addEventListener('click', () => this.selectAllBoxes());
        header.appendChild(selectAllBtn);

        // Create and append "Clear" button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => this.clearSelection());
        header.appendChild(clearBtn);
    }

    // Override addBox to include specialized behavior
    addBox(index, eventHandlers = {}) {
        // Assuming super.addBox adds the box object to this.boxes
        const boxObject = super.addBox(index, {
            ...eventHandlers,
            click: (event) => {
                // Assuming the box object is stored in the dataset or accessible directly
                this.toggleSelection(event.currentTarget, this.boxes[index]);
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

    selectAllBoxes() {
        this.boxes.forEach(box => {
            box.element.classList.add('drag-selected');
            this.selectedBoxes.add(box); // Directly add the box object
            console.log(this.selectedBoxes);
        });
    }

    clearSelection() {
        this.selectedBoxes.forEach(box => {
            box.element.classList.remove('drag-selected');
        });
        this.selectedBoxes.clear();
        console.log(this.selectedBoxes);
    }
}


