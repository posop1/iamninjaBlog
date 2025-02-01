---
title: Project Dedic
date: '2025-02-02 14:23:00'
---

Добавил пользователей: [[How to Add User to Sudoers or Sudo Group on Ubuntu]]
[[red_hat_enterprise_linux-7-virtualization_deployment_and_administration_guide-en-us.pdf]]

Настроил авторизацию только по ключам:

```shell
ssh-keygen -t rsa
cd .ssh/
cat id_rsa.pub >> ~/.ssh/authorized_keys
-
cat id_rsa

cat /etc/ssh/sshd_config
AuthorizedKeysFile      .ssh/authorized_keys .ssh/authorized_keys2
PubkeyAuthentication yes
#PermitRootLogin yes
PasswordAuthentication no
```

<!-- truncate -->

Установил kvm+qemu:

```shell
apt install qemu-kvm virtinst libvirt-clients bridge-utils libvirt-daemon-system
```

Установил первую виртуалку:

```
virt-install \
  --virt-type=kvm \
  --name s_proxy2204\
  --ram 2048 \
  --vcpus=2 \
  --os-variant=ubuntu22.04 \
  --hvm \
  --cdrom=/vm-ssd/ubuntu-22.04.3-live-server-amd64.iso \
  --network network=default,model=virtio \
  --graphics vnc \
  --disk path=/vm-ssd/s_images/s_proxy2204.qcow2,size=40,bus=virtio
```

Смотрим какой порт задействовала виртуалка:

```shell
virsh dumpxml <vm_name>

<graphics type='vnc' port='5900' autoport='yes' listen='127.0.0.1'>
      <listen type='address' address='127.0.0.1'/>
    </graphics>
```

Этот же порт указываем при настройке VNC тунеля - 5900.

После запуска установки, подключаемся через VNC, предварительно подняв VNC over SSH тунель:
![[Pasted image 20231113110445.png]]

![[Pasted image 20231113110422.png]] Добавляем rsa ключ для авторизации:
![[Pasted image 20231113110546.png]]

Далее, запускаем тунель, идём "Session" - "VNC", указываем Remote hostname 127.0.0.1 port 8888,
подключаемся. Продолжаем установку машины в VNC сессии.

Настройка резервирования DHCP KVM:

```shell
virsh net-list --all
virsh dumpxml <vmname> | grep 'mac address'
virsh net-edit default
```

После секции

```xml
<range>
```

добавляем статическую запись:

```xml
<host mac='52:54:00:46:05:e7' name='s_proxy2204' ip='192.168.122.3'/>
```

Листинг:

```xml
<network>
  <name>default</name>
  <uuid>72019e0a-e92b-4f77-af2e-1b9f736596f8</uuid>
  <forward mode='route'/>
  <bridge name='virbr0' stp='on' delay='0'/>
  <mac address='52:54:00:89:80:fd'/>
  <ip address='192.168.122.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.122.2' end='192.168.122.254'/>
      <host mac='52:54:00:46:05:e7' name='s_proxy2204' ip='192.168.122.3'/>
    </dhcp>
  </ip>
</network>
```

Применяем

```shell
virsh net-destroy default
virsh net-start default
virsh shutdown s_proxy2204
virsh start s_proxy2204
```

Список всех leases:

```shell
virsh net-dhcp-leases default
```

![[Pasted image 20231114011202.png]] на 14.11.2023:

```xml
<network>
  <name>default</name>
  <uuid>72019e0a-e92b-4f77-af2e-1b9f736596f8</uuid>
  <forward mode='route'/>
  <bridge name='virbr0' stp='on' delay='0'/>
  <mac address='52:54:00:89:80:fd'/>
  <ip address='192.168.122.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.122.2' end='192.168.122.254'/>
      <host mac='52:54:00:46:05:e7' name='s_proxy2204' ip='192.168.122.3'/>
      <host mac='52:54:00:7b:10:df' name='v_ubuntu2204' ip='192.168.122.4'/>
      <host mac='52:54:00:d4:02:6b' name='s_docker2204' ip='192.168.122.5'/>
      <host mac='52:54:00:40:fe:b1' name='s_web_app2204' ip='192.168.122.6'/>
      <host mac='52:54:00:d4:e8:27' name='s_k3s_master' ip='192.168.122.7'/>
      <host mac='52:54:00:f7:56:d0' name='s_k3s_node01' ip='192.168.122.8'/>
    </dhcp>
  </ip>
</network>
```

Если нам нужно почистить leases:

```shell
cat /dev/null > /var/lib/libvirt/dnsmasq/virbr0.status
```

Иногда настройки DHCP KVM применяются только после рестарта самого хоста виртуализации, хз с чем
связанно, видимо мы тупые и нез наем какую службу нужно дёрнуть.

Далее настраиваем Форвардинг портов извне на виртуальную машину, порт 22 для подключения по SSH.

Делаем предварительные настройки по гайду: [[KVM port forwarding with UFW]]

наше правило таблицы NAT и прероутинга:

```shell
*nat
:PREROUTING ACCEPT [0:0]
:POSTROUTING ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]

-A PREROUTING -i enp2s0 -d 31.192.105.120 -p tcp -m tcp --dport 22023 -m comment --comment "nginx-proxy SSH" -j DNAT --to-destination 192.168.122.3:22
-A PREROUTING -i enp2s0 -d 31.192.105.120 -p tcp -m tcp --dport 22024 -m comment --comment "v_ubuntu2204 SSH" -j DNAT --to-destination 192.168.122.4:22
-A PREROUTING -i enp2s0 -d 31.192.105.120 -p tcp -m tcp --dport 22025 -m comment --comment "s_docker2204 SSH" -j DNAT --to-destination 192.168.122.5:22
-A PREROUTING -i enp2s0 -d 31.192.105.120 -p tcp -m tcp --dport 22026 -m comment --comment "s_web_app2204 SSH" -j DNAT --to-destination 192.168.122.6:22
-A PREROUTING -i enp2s0 -d 31.192.105.120 -p tcp -m tcp --dport 22027 -m comment --comment "s_k3s_master SSH" -j DNAT --to-destination 192.168.122.7:22
-A PREROUTING -i enp2s0 -d 31.192.105.120 -p tcp -m tcp --dport 22028 -m comment --comment "s_k3s_node01 SSH" -j DNAT --to-destination 192.168.122.8:22
-A PREROUTING -d 31.192.105.120/32 -p tcp -m multiport --dports 80,443 -m comment --comment "NGINX HTTP/HTTPS" -j DNAT --to-destination 192.168.122.3
-A OUTPUT -d 31.192.105.120/32 -p tcp -m tcp --dport 80 -m comment --comment "HOST to NGINX HTTP" -j DNAT --to-destination 192.168.122.3:80
-A OUTPUT -d 31.192.105.120/32 -p tcp -m tcp --dport 443 -m comment --comment "HOST to NGINX HTTPS" -j DNAT --to-destination 192.168.122.3:443
-A POSTROUTING -s 192.168.122.0/24 -o enp2s0 -j MASQUERADE
-A POSTROUTING -s 192.168.122.0/24 ! -d 192.168.122.0/24 -j MASQUERADE

COMMIT

```

На 192.168.122.3 поднят реверс прокси Nginx: sample конфиг. Настроен wildcard ssl сертификат,
который обноваляется crontab -e каждые 85 дней.

```
0 0 */85 * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

```shell

server {
        listen      80;
        server_name sample.iamninja.ru;

        return 301 https://$host$request_uri;
}

server {
        listen      443 ssl http2;
        server_name sample.iamninja.ru;

        access_log  /var/log/sample.iamninja.ru.ssl.access.log;
        error_log   /var/log/sample.iamninja.ru.ssl.error.log;

        ssl_certificate /etc/letsencrypt/live/iamninja.ru/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/iamninja.ru/privkey.pem;
#       include /etc/letsencrypt/options-ssl-nginx.conf;
#       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
#                proxy_pass   http://192.168.100.15;
#                proxy_set_header HOST $host;
#                proxy_set_header X-Forwarded-Proto $scheme;
#                proxy_set_header X-Real-IP $remote_addr;
#                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                add_header Host $http_host;
                add_header X-Real-IP $remote_addr;
                add_header X-Forwarded-For $proxy_add_x_forwarded_for;
                add_header X-Forwarded-Proto $scheme;
                add_header X-Frame-Options SAMEORIGIN;
                add_header X-Content-Type-Options nosniff;
                add_header X-XSS-Protection "1; mode=block";
                add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
                add_header Referrer-Policy "strict-origin";
                add_header Permissions-Policy "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()";
                client_max_body_size 0;
                proxy_buffers  16 32k;
                proxy_buffer_size 64k;
                proxy_connect_timeout 600s;
                proxy_send_timeout    600s;
                proxy_read_timeout    600s;
                send_timeout          600s;
                server_tokens   off;
        }

#       location /robots.txt {
#                       alias /var/www/robots.txt;
#       }
}

```

Загрузка VM v_kali2023 происходит каждый раз с iso образа который лежит в /vm-sdd/ Сделано с помощью
следующего метода: [[booting KVM VM from an iso image – .pQd's log]]

Сделан бэкап конфигураций и дисков VM, сюда - /data/backups Таким методом:
[[Backup and Restore KVM Vms. Introduction  by Sylia CHIBOUB  Medium]]

Бэкапы на лету [[VIRSH Backups]] Оркестрация Ansible: [[Ansible dodic]]
