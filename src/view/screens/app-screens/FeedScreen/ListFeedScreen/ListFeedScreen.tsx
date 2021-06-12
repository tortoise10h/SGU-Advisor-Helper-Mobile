import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';

import styles from './styles';
import FeedCard from './components/FeedCard';
import FloatingCreateButton from '../componennts/FloatingCreateButton';
import ScreenName from '../../../../../common/constants/screen-name';
import {
  selectFetchMoreAt,
  selectPostLastChangedAt,
  selectPostPagin,
  selectPosts,
  selectRefreshAt,
} from '../../../../../redux/state/post/slice';
import {
  fetchMorePostsSagaAction,
  fetchPostsSagaAction,
} from '../../../../../redux/state/post/saga-types';
import { selectCurrentClass } from '../../../../../redux/state/class/slice';
import { IFeedData } from './interfaces';
import { selectCurrentMemberShip } from '../../../../../redux/state/user/slice';
import { ClassCorePositions } from '../../../../../common/constants/user';
import { appColor } from '../../../../styles/color';

const ListFeedScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  const scrollViewRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const feedList = useSelector(selectPosts);
  const postPagin = useSelector(selectPostPagin);
  const currentClass = useSelector(selectCurrentClass);
  const postsLastChangedAt = useSelector(selectPostLastChangedAt);
  const postRefreshAt = useSelector(selectRefreshAt);
  const fetchMoreAt = useSelector(selectFetchMoreAt);
  const currentMembership = useSelector(state => selectCurrentMemberShip(state, currentClass.id));

  const navigateToDetailScreen = (selectedFeed: any) => {
    const selectedFeedStringify = JSON.stringify(selectedFeed);
    navigation.navigate(ScreenName.FEED_DETAIL_SCREEN, {
      feed: selectedFeedStringify,
    });
  };

  useEffect(() => {
    if (currentClass.id) {
      dispatch({ type: fetchPostsSagaAction.type, payload: { classroomId: currentClass.id } });
    }
  }, [currentClass, postsLastChangedAt]);

  useEffect(() => {
    setRefreshing(false);
  }, [postRefreshAt]);

  useEffect(() => {
    setLoading(false);
    setRefreshing(false);
  }, [fetchMoreAt]);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: any;
    contentOffset: any;
    contentSize: any;
  }) => {
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      return true;
    }

    return false;
  };

  const fetchMorePosts = () => {
    if (postPagin.currentPage < postPagin.totalPages && !loading) {
      const nextPage = postPagin.currentPage + 1;
      setLoading(true);
      dispatch({
        type: fetchMorePostsSagaAction.type,
        payload: { classroomId: currentClass.id, page: nextPage },
      });
    }
  };

  const onRefresh = () => {
    if (currentClass.id) {
      setRefreshing(true);
      dispatch({ type: fetchPostsSagaAction.type, payload: { classroomId: currentClass.id } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            fetchMorePosts();
          }
        }}>
        {feedList.length
          ? feedList.map((feed: IFeedData, index: number) => (
              <FeedCard key={index} post={feed} navigateToDetailScreen={navigateToDetailScreen} />
            ))
          : null}
        {loading ? <ActivityIndicator animating={true} color={appColor.primaryColor} /> : null}
      </ScrollView>
      {currentMembership && ClassCorePositions.includes(currentMembership.position) ? (
        <FloatingCreateButton navigation={navigation} />
      ) : null}
    </SafeAreaView>
  );
};

export default ListFeedScreen;
