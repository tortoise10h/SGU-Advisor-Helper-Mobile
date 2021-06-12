import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import HTML from 'react-native-render-html';
import truncate from 'truncate-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import { ImageMimes } from '../../../../../../common/constants/file-mime';
import styles from '../styles';
import { IFeedData } from '../interfaces';
import ClassMemberRoleBadge from '../../../../../components/common/UserInClassBadge/ClassMemberRoleBadge';

const FeedCard = ({
  post,
  navigateToDetailScreen,
}: {
  post: IFeedData;
  navigateToDetailScreen: any;
}) => {
  const firstImage = post.attachments.find((a: any) => ImageMimes.includes(a.type));
  const contentMaxLength = 450;
  const displayContent = truncate(post.content, contentMaxLength);

  return (
    <View style={styles.feedCardParentContainer}>
      <Card style={styles.feedCardContainer} onPress={() => navigateToDetailScreen(post)}>
        {firstImage ? <Card.Cover source={{ uri: firstImage.url }} /> : null}
        <Card.Title
          subtitle={`${moment(post.createdAt).format('DD/MM/YYYY h:mm a')}`}
          title={post.title}
          style={styles.feedCardTitle}
          titleNumberOfLines={3}
        />
        <Card.Content style={styles.feedCardAuthorInfoContainer}>
          <Avatar.Text
            size={28}
            label={post.author && post.author.firstName ? post.author.firstName.slice(0, 1) : 'X'}
            style={styles.feedCardAuthorAvatar}
          />
          <Text
            style={
              styles.feedCardAuthorName
            }>{`${post.author.lastName} ${post.author.firstName}`}</Text>
          <ClassMemberRoleBadge
            value={post.author.positionInClassroom}
            containerStyle={styles.feedCardAuthorBadgeContainerStyle}
            badgeStyle={styles.feedCardAuthorBadgeStyle}
          />
        </Card.Content>
        <Card.Content style={styles.feedCardContentContainer}>
          <View>
            {/* Do not use StyleSheet style for this one */}
            <HTML
              tagsStyles={{ p: { color: 'black', lineHeight: 20 } }}
              baseFontStyle={{ lineHeight: 20 }}
              source={{ html: displayContent }}
            />
          </View>
          <View>
            {displayContent.length > contentMaxLength ? (
              <Button onPress={() => navigateToDetailScreen(post)}>Đọc thêm</Button>
            ) : null}
          </View>
        </Card.Content>
        <Card.Actions>
          <View style={styles.feedCardActionContainer}>
            <View style={styles.feedCardActionButtonZone}>
              <TouchableOpacity onPress={() => navigateToDetailScreen(post)}>
                <Button
                  labelStyle={styles.feedCardActionBtnLabel}
                  icon={() => <Ionicons name="chatbubble-outline" size={20} />}>
                  {post.totalComment}
                </Button>
              </TouchableOpacity>
              <Button
                labelStyle={styles.feedCardActionBtnLabel}
                icon={() => <MaterialCommunityIcons name="attachment" size={20} />}>
                {post.attachments.length}
              </Button>
            </View>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default FeedCard;
