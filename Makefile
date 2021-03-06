PLUGIN_NAME = custom-data-type-goobi

L10N_FILES = easydb-library/src/commons.l10n.csv \
    l10n/$(PLUGIN_NAME).csv
L10N_GOOGLE_KEY = 1ux8r_kpskdAwTaTjqrk92up5eyyILkpsv4k96QltmI0
L10N_GOOGLE_GID = 1356825252
L10N2JSON = python easydb-library/tools/l10n2json.py

INSTALL_FILES = \
	$(WEB)/l10n/cultures.json \
	$(WEB)/l10n/de-DE.json \
	$(WEB)/l10n/en-US.json \
	$(WEB)/l10n/es-ES.json \
	$(WEB)/l10n/it-IT.json \
    $(WEB)/custom-data-type-goobi.scss \
	$(JS) \
	CustomDataTypeGoobi.config.yml

COFFEE_FILES = easydb-library/src/commons.coffee \
	src/webfrontend/CustomDataTypeGoobi.coffee

all: build

SCSS_FILES = src/webfrontend/scss/main.scss

include easydb-library/tools/base-plugins.make

build: code $(L10N) $(SCSS)

code: $(JS)

clean: clean-base

wipe: wipe-base

.PHONY: clean wipe
