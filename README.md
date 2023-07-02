# Digital Detox Adventure Club website


## Deploy with Ansible

1. Adjust ansible/config.yml if needed

2. Adjust ansible/inventory.ini and test connection:
```
ansible -i inventory.ini all -m ping
```

1. Run playbooks one by one 
```
cd ansible
$ ansible-playbook -i inventory.ini 1-setup-nginx.yml
$ ansible-playbook -i inventory.ini 2-setup-certbot.yml
```

2. If you need to run only certain steps, use tags, e.g.:
```
$ ansible-playbook -i inventory.ini 2-setup-certbot.yml --tags "dry"
```
or
```
$ ansible-playbook -i inventory.ini 1-setup-nginx.yml --tags "copy"
```