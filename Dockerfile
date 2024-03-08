FROM ubuntu:latest

# Install SSH server
RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd

# Set up a user (e.g., 'testuser') with a password or SSH key
RUN useradd -m -s /bin/bash testuser && \
    echo 'testuser:testpassword' | chpasswd

# Copy the public key into the container and set appropriate permissions
COPY id_rsa.pub /home/testuser/.ssh/authorized_keys
RUN chown testuser:testuser /home/testuser/.ssh/authorized_keys && \
    chmod 600 /home/testuser/.ssh/authorized_keys

# Expose the SSH port
EXPOSE 22

# Start the SSH server
CMD ["/usr/sbin/sshd", "-D"]
