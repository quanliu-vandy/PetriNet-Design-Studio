"""
This is where the implementation of the plugin code goes.
The ModelicaCodeGenerator-class is imported from both run_plugin.py and run_debug.py
"""
import sys
import logging
from webgme_bindings import PluginBase

# Setup a logger
logger = logging.getLogger('ModelicaCodeGenerator')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)  # By default it logs to stderr..
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


class ModelicaCodeGenerator(PluginBase):
    def main(self):
        core = self.core
        root_node = self.root_node
        active_node = self.active_node
        META = self.META

        message = []
        nodes = core.load_sub_tree(active_node)
        net_record = {'Place':[], 'Transition':[], 'InLine':[], 'OutLine':[]}


        for node in nodes:
            if core.is_type_of(node.META['Place']):
                node_data = {}
                node_data['name'] = core.get_attribute(node, 'name')
                node_data['path'] = core.get_path(node)
                node_data['marking'] = core,get_attribute(node, marking)
                net_record['Place'].append(node_data)

            elif core.is_type_of(node.META['Transition']):
                node_data = {}
                node_data['name'] = core.get_attribute(node, 'name')
                node_data['path'] = core.get_path(node)
                net_record['Transition'].append(node_data)

            elif core.is_type_of(node.META['InLine']):
                node_data = {}
                node_data['name'] = core.get_attribute(node, 'name')
                node_data['path'] = core.get_path(node)
                node_data['src'] = core.get_pointer_path(node, 'src')
                node_data['dst'] = core.get_pointer_path(node, 'dst')
                net_record['InLine'].append(node_data)

            elif core.is_type_of(node.META['Outline']):
                node_data = {}
                node_data['name'] = core.get_attribute(node, 'name')
                node_data['path'] = core.get_path(node)
                node_data['src'] = core.get_pointer_path(node, 'src')
                node_data['dst'] = core.get_pointer_path(node, 'dst')
                net_record['OutLine'].append(node_data)



        for place in net_record['Place']:
            message = 'Place ' + place['name'] + ' ' + place['path'] + ' ' + str(place['marking'])
            self.create_message(active_node, message, severity='info')
        for transition in net_record['Transition']:
            message = 'Transition ' + transition['name'] + ' ' + transition['path']
            self.create_message(active_node, message, severity='info')

        for inLine in net_record['InLine']:
            message = 'InLine ' + inLine['name'] + ' ' + inLine['path'] + ' ' + inLine['src'] +  ' ' + inLine['dst']
            self.create_message(active_node, message, severity='info')
        for outLine in net_record['Outline']:
            message = 'OutLine ' + outLine['name'] + ' ' + outLine['path'] + ' ' + outLine['src'] +  ' ' + outLine['dst']
            self.create_message(active_node, message, severity='info')

        classification = '1, 0, 1, 0'
        self.create_message(active_node, classification, severity='info')

        with open('message.txt', 'w') as f:
            f.write(str(message))

        logger.info('ActiveNode at "{0}" has name {1}'.format(core.get_path(active_node), name))

        core.set_attribute(active_node, 'name', 'newName')

        commit_info = self.util.save(root_node, self.commit_hash, 'master', 'Python plugin updated the model')
        logger.info('committed :{0}'.format(commit_info))
