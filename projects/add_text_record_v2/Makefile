# Copyright 2023 BlueCat Networks (USA) Inc. and its affiliates. All Rights Reserved.

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
parentdir := $(shell dirname $(mkfile_path))

ui-req:
	cd $(parentdir)/add_text_record_v2_ui && npm install

ui-build:
	cd $(parentdir)/add_text_record_v2_ui \
		&& export NODE_ENV=production \
		&& npm run build

clean:
	rm -rf \
		$(parentdir)/../../workspace/workflows/add_text_record_v2/fonts \
		$(parentdir)/../../workspace/workflows/add_text_record_v2/html \
		$(parentdir)/../../workspace/workflows/add_text_record_v2/img \
		$(parentdir)/../../workspace/workflows/add_text_record_v2/js

purge: clean
	rm -rf $(parentdir)/add_text_record_v2_ui/node_modules
