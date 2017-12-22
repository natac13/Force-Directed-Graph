import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';

import ForceDirectedGraph from 'Components/ForceDirectedGraph/';
import style from './style.scss';

export default class DataWrapper extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    console.log(props)
    /** Styling */
    const wrapperClass = classnames({
      [style.wrapper]: true,
      [props.className]: !!props.className,
    });

    /** State Creation */
    this.state = {
      wrapperClass,
      data: props.data,
      width: window.innerWidth,
      height: window.innerHeight,
      title: 'Global Temperature &#2103;C',
    };
  }


  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const { data } = nextProps;

    this.setState({
      data,
    });

  }


  render() {
    const {
      wrapperClass,
      data,
      width,
      height,
    } = this.state;

    return (
      <section className={wrapperClass}>
        <ForceDirectedGraph
          data={data}
          width={width}
          height={height}
        />

      </section>
    );
  }

}
