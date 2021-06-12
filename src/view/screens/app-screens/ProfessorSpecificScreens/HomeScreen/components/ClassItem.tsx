import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { appColor } from '../../../../../styles/color';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styles from '../style';

const ClassItem = ({ classData, navigate }: { classData: any, navigate: any }) => {
  return (
    <TouchableOpacity onPress={() => navigate(classData.id, {})}>
      <LinearGradient
        colors={[appColor.secondaryColor, '#8391f7']}
        style={styles.classItem}
        end={{ x: 0.55, y: 1 }}
        start={{ x: 0.55, y: 0 }}>
        <View style={{ flex: 7 }}>
          <Text style={styles.classItemTitle}>Lớp {classData.code}</Text>
        </View>
        <View style={{ flex: 3 }}>
          <View style={styles.classItemSubTextZone}>
            <Text style={{ ...styles.classItemSubText, flex: 6 }}>
              Ngành {classData.major.name}
            </Text>
            <Text style={{ ...styles.classItemSubText, textAlign: 'right', flex: 4 }}>
              <AntDesignIcon name="clockcircleo" size={15} /> {classData.schoolYearStart} -{' '}
              {classData.schoolYearEnd}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ClassItem;
