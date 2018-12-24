import React from 'react'
import { Image } from 'react-native'
import { View, Container, Content, Text, Icon, List, ListItem } from 'native-base'

import settings from './../../../config/settings'
import { sophieLogoNoText } from './../../../config/images'
import styles from './styles'

export default class SideBar extends React.Component {
	handleNavigate = (path) => {
		const { navigation, onClose } = this.props
		navigation.navigate(path)
		onClose()
	}
	render() {
		return (
			<Container>
				<Content>
					<View style={styles.header}>
						<Text style={styles.headerText}>Casarotto Chat</Text>
						<Text style={styles.versionText}>v{settings.VERSION}</Text>
					</View>
					<List>
						<ListItem button onPress={() => this.handleNavigate('Profile')}>
							<Icon type="MaterialIcons" name="person" style={styles.itemIcon} />
							<Text style={styles.itemText}>Profile</Text>
						</ListItem>
					</List>
				</Content>
			</Container>
		)
	}
}
