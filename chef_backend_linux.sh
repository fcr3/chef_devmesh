#!/bin/bash

echo $PWD

gnome-terminal -e "redis-server"
gnome-terminal -e "celery worker -A openvino_backend.celery --loglevel=info"
python3 openvino_backend.py
