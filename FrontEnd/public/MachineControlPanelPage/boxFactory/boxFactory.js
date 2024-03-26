
    function addButton(container, text, id, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'button-86';
        button.id = id;
        button.addEventListener('click', onClick);
        container.appendChild(button);
    }
    

class BoxContainerManager {
    constructor() {
        this.rows = [];
        this.rowMap = {};
        this.root = document.getElementById('boxFactoryRoot');
        if (!this.root) {
            console.error('Root container not found');
            return;
        }
        this.createHeader();
    }

    createHeader() {
        const rootHeader = document.createElement('div');
        rootHeader.className = '';
        rootHeader.id = 'sectionHeader'
        rootHeader.textContent = '';
        this.root.appendChild(rootHeader);

        addButton(rootHeader, 'Select All', 'selectAllBtn', () => this.selectAllBoxes());
        addButton(rootHeader, 'Clear', 'clearAllBtn', () => this.clearAllSelection());
    }

    createRowContainer(sectionId, rowLabel, RowContainerClass = RowContainerBase, ...additionalArgs) {
        // Check if the row already exists to prevent duplicates
        if (this.rowMap[rowLabel]) {
            console.warn(`Row ${rowLabel} already exists.`);
            return;
        }
    
        // Find or create the section-container for the new row
        let sectionContainer = this.root.querySelector('.section-container');
        if (!sectionContainer) {
            sectionContainer = document.createElement('div');
            sectionContainer.className = 'section-container';
            this.root.appendChild(sectionContainer); // Append the section-container directly to the root
        }
    
        // Find or create the section for the new row
        let section = sectionContainer.querySelector(`#${sectionId}`);
        if (!section) {
            section = document.createElement('div');
            section.className = 'section';
            section.id = sectionId;
            sectionContainer.appendChild(section); // Append the section to the section-container
        }
    
        // Instantiate the RowContainer with the provided class and additional arguments
        const rowContainerInstance = new RowContainerClass(sectionId, rowLabel, ...additionalArgs);
    
        // Check if rowContainerInstance properly created its container
        if (rowContainerInstance.container) {
            section.appendChild(rowContainerInstance.container); // Append the row container to the newly created or existing section
            this.rows.push(rowContainerInstance);
            this.rowMap[rowLabel] = rowContainerInstance;
        } else {
            console.error("Failed to create or access row container.");
        }
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

    getSelectedBoxesAll() {
        let selectedBoxesAll = [];
        this.rows.forEach(row => {
            selectedBoxesAll.push(...row.getSelectedBoxesRow())
        });
        return selectedBoxesAll
    }

    getSelectedBoxesIps() {
        // Use getSelectedBoxesAll to get all selected boxes
        const selectedBoxes = this.getSelectedBoxesAll();
        // Map over these boxes to extract the 'ip' property
        const selectedIps = selectedBoxes.map(box => box.ip);
        return selectedIps;
    }

    selectAllBoxes() {
        this.rows.forEach(row => row.selectAllRowBoxes());
    }

    clearAllSelection() {
        this.rows.forEach(row => row.clearRowSelection())
    }

    getMachineCount() {
        return this.getObjAll().length
    }

}

class RowContainerBase {
    constructor(sectionId, rowLabel) {
        this.sectionId = sectionId;
        this.rowLabel = rowLabel;
        this.racks = []; // This will store RackContainer instances

        // Directly initialize the container for the row, no need for an additional 'rowContainer'.
        this.container = document.createElement('div');
        this.container.className = 'row-container';
        this.container.setAttribute('data-row', this.rowLabel);

        // You might not need 'sectionContainer' here unless it's used differently than shown.
        // If each row is directly within a 'section', that should be handled in BoxContainerManager.

        this.createHeader(); // Create the header as part of the row container initialization.
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
        header.textContent = `Section: ${this.sectionId}, Row: ${this.rowLabel}`;

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

        // Append the header directly to the row's container.
        this.container.appendChild(header);
    }


    addRack(rackLabel, defaultBoxCount = 20, RackContainerClass = RackContainerBase, ...additionalArgs) {
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
    
    getSelectedBoxesRow() {
        let selectedBoxesRow = [];
        this.racks.forEach(rack => {
            selectedBoxesRow.push(...rack.getSelectedBoxesRack())
        });
        return selectedBoxesRow
    }

    selectAllRowBoxes() {
        this.racks.forEach(rack => rack.selectAllRackBoxes());
    }

    clearRowSelection() {
        this.racks.forEach(rack => rack.clearRackSelection());
    }


}

class RackContainerBase{
    constructor(sectionId, rowLabel, rackLabel, defaultBoxCount = 20) {
        this.sectionId = sectionId;
        this.rowLabel = rowLabel;
        this.rackLabel = rackLabel;
        this._selectedBoxesRack = new Set(); // To track selected boxes
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
            this.addBox(i, {});
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
                this.addBox(i, { click: () => console.log(`Box ${i} clicked`) });
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

    getSelectedBoxesRack() {
        return this._selectedBoxesRack
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
        const boxObject = super.addBox(index, {
            ...eventHandlers,
            click: (event) => {
                // Find the box object as before
                const currentIndex = this.boxes.findIndex(box => box.element === event.currentTarget);
                const box = this.boxes[currentIndex];
                box.toggleSelected(); // Toggle selection state using the Box's method
                if (box.isSelected()) {
                    // DEBUGGING LINE
                    //////////////////////////////////////////////////////
                    // console.log('adding box to selected list:', box)
                    //////////////////////////////////////////////////////

                    this._selectedBoxesRack.add(box);

                    // DEBUGGING LINE
                    //////////////////////////////////////////////////////
                    // console.log('added to list:', this.selectedBoxes)
                    //////////////////////////////////////////////////////
                } else {
                    this._selectedBoxesRack.delete(box);
                }

                // DEBUGGING LINE
                //////////////////////////////////////////////////////
                // console.log(`Specialized box ${index} clicked ;)`);
                //////////////////////////////////////////////////////

                eventHandlers.click?.(event);
            }
        });
    }

    selectAllRackBoxes() {
        this.boxes.forEach(box => {
            // Only select boxes that aren't already selected
            if (!box.isSelected()) {
                box.toggleSelected(); // This updates both the class and the selected state
                this._selectedBoxesRack.add(box); // Keep track of selected boxes
                
            }
        });
    }

    clearRackSelection() {
        this.boxes.forEach(box => {
            box.clearSelection();
        });
        this._selectedBoxesRack.clear();
        // DEBUGGING LINE
        //////////////////////////////////////////////////////
        // console.log(this.selectedBoxes);
        //////////////////////////////////////////////////////
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
        this._isRunning = false
        this._isSelected = false;
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

    toggleSelected() {
        this._isSelected = !this._isSelected;
        if (this._isSelected) {
            this.element.classList.add('drag-selected');
        } else {
            this.element.classList.remove('drag-selected');
        }
        console.log(`Box ${this.id} selected: ${this._isSelected}`);
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

    getStatus() {
        return this._isRunning
    }

    setStatus(val) {
        this._isRunning = val
    }

    isSelected() {
        return this._isSelected
    }

    clearSelection() {
        if (this._isSelected) { // Check if the box is currently selected
            this._isSelected = false; // Update the selection state to false
            this.element.classList.remove('drag-selected'); // Visually unselect the box
            console.log(`Box ${this.id} selection cleared`);
        }
    }
}





