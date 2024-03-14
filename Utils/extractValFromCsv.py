import csv
import json
import os

def extract_and_save_json(input_dir, output_file):
    # This list will hold all the extracted data
    data_list = []
    
    # Iterate through every file in the directory
    for filename in os.listdir(input_dir):
        # Check if the file is a CSV
        if filename.endswith('.csv'):
            # Construct the full path to the file
            full_path = os.path.join(input_dir, filename)
            # Open and read the CSV file
            with open(full_path, mode='r', encoding='utf-8') as csv_file:
                csv_reader = csv.DictReader(csv_file)
                # Iterate through rows in the CSV file
                for row in csv_reader:
                    # Extract and format the required information
                    rig_data = {
                        row['Rig']: {
                            'MAC (NIC-1) enp031f6': row['MAC (NIC-1) enp031f6'],
                            'MAC (NIC-2) enp2s0': row['MAC (NIC-2) enp2s0'],
                            'IP': row['IP'],
                            'PDU IP': row['PDU IP'],
                            'PDU Port': row['PDU Port #'],
                        }
                    }
                    # Append the extracted data to the list
                    data_list.append(rig_data)
    
    # Write the extracted data to the specified JSON file
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(data_list, json_file, indent=4)
        
def append_csv_to_json(csv_file_path, json_file_path):
    data_list = []
    # Read the existing JSON file first, if it exists
    if os.path.exists(json_file_path):
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            data_list = json.load(json_file)
    
    # Open and read the CSV file
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        # Iterate through rows in the CSV file
        for row in csv_reader:
            # Extract and format the required information, ignoring the 'OLD' columns
            rig_data = {
                row['Rig']: {
                    'MAC (NIC-1) enp031f6': row['MAC (NIC-1) enp031f6'],
                    'MAC (NIC-2) enp2s0': row['MAC (NIC-2) enp2s0'],
                    'IP': row['IP'],
                    'PDU IP': row['PDU IP'],
                    'PDU Port': row['PDU Port #'],
                }
            }
            # Append the extracted data to the list
            data_list.append(rig_data)
    
    # Write the updated data list to the JSON file
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data_list, json_file, indent=4)
        
def reorder_json_by_ip(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as input_file:
        data = json.load(input_file)
    
    # Custom sorting function to sort by IP address
    def ip_key(item):
        return [int(octet) for octet in item['IP'].split('.')]
    
    # Sorting the data based on IP address
    sorted_data = sorted(data, key=ip_key)

    with open(output_path, 'w', encoding='utf-8') as output_file:
        json.dump(sorted_data, output_file, indent=4)

# Example usage
# extract_and_save_json('../DC02_MACHINE_HARDWARE', 'DC02_HARDWARE_INFO.json')

# Path to the CSV file and the output JSON file
# csv_file_path = '../DC02_GPU_Hardware_Software_Research - B2_Status.csv'
# json_file_path = './DC02_HARDWARE_INFO.json'

# # Append data from the new CSV file to the existing JSON file
# append_csv_to_json(csv_file_path, json_file_path)

input_path = './DC02_HARDWARE_INFO.json'
output_path = 'DC02_HARDWARE_INFO_SORTED.json'

# This is a placeholder since I can't directly run file operations that access the file system here.
# You would replace 'input.json' and 'sorted_output.json' with your actual input and output file paths and run this function in your local environment.
reorder_json_by_ip(input_path, output_path)